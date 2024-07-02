# frozen_string_literal: true

class Match < ApplicationRecord
  serialize :lineup, coder: JSON
end
