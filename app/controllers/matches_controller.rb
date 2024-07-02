class MatchesController < ApplicationController
  def index
    @matches = Match.all
  end

  def create
    m = Match.create(params[:match].permit(:round, :opponent))
    render :json => m
  end

  def show
    @match = Match.where(round: params[:round]).first
    raise ActiveRecord::RecordNotFound.new("Round #{params[:round]} not found") if @match.nil?
    @players = Player.active
  end

  def update
  end

  def destroy
    Match.delete(params[:id])
    render :json => params
  end
end